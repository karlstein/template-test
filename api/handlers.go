package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

// Upload an update
func uploadUpdate(c *gin.Context) {
	var payload UploadUpdatePayloadModel
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var dkModel *DeploymentKey
	result := db.Where("key = ?", payload.DeploymentKey).
		Order("created_at DESC").First(&dkModel)

	if result.Error != nil || dkModel == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No deployment found"})
		return
	}

	payload.Update.ProjectID = dkModel.ProjectID

	// Store metadata in DB
	db.Create(&payload.Update)

	c.JSON(http.StatusOK, gin.H{"message": "Update uploaded successfully", "data": payload})
}

// Get latest update
func getLatestUpdate(c *gin.Context) {
	platform := c.Query("platform")
	environment := c.Query("environment")

	var latestUpdate Update
	result := db.Where("platform = ? AND environment = ?", platform, environment).
		Order("created_at DESC").First(&latestUpdate)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No update found"})
		return
	}

	c.JSON(http.StatusOK, latestUpdate)
}

// Rollback update
func rollbackUpdate(c *gin.Context) {
	environment := c.Query("environment")

	var latestUpdate Update
	result := db.Where("environment = ?", environment).
		Order("created_at DESC").Limit(1).Delete(&latestUpdate)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Rollback failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rollback successful"})
}

// Download update file from MinIO
func downloadUpdate(c *gin.Context) {
	fileName := c.Param("fileName")
	bucket := getEnv("S3_BUCKET", "codepush-updates")

	resp, err := s3Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
	})
	if err != nil {
		log.Println("Error fetching file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "File not found"})
		return
	}
	defer resp.Body.Close()

	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", fileName))
	c.DataFromReader(http.StatusOK, *resp.ContentLength, "application/octet-stream", resp.Body, nil)
}

type LoginModel struct {
	User                User   `json:"user"`
	ProviderAccessToken string `json:"provider_access_token"`
	Token               string `json:"token"`
}

// User Login
func userLogin(c *gin.Context) {
	var login LoginModel

	fmt.Println("userLogin")

	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := login.User

	result := db.Where(&User{Email: user.Email}).First(&user)
	if result.RowsAffected == 0 {
		db.Create(&user)
	}

	token, err := GenerateJWT(user.ID, login.ProviderAccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	login.User = user
	login.Token = token

	c.JSON(http.StatusOK, gin.H{
		"message": "User logged in successfully",
		"data":    login,
	})
}

func userLogout(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", true, true) // Expire the cookie
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Get all project
func getAllProject(c *gin.Context) {
	reqInfo := getReqInfo(c)

	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var projects []Project
	result := db.Raw(`SELECT p.* 
		FROM projects p
		LEFT JOIN teams t ON t.project_id = p.id
		WHERE t.user_id = @user_id 
		OR p.user_id = @user_id`,
		sql.Named("user_id", 1)).
		Scan(&projects)

	if result.Error != nil || len(projects) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No project found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": projects})
}

// Get project with update list
func getProjectUpdates(c *gin.Context) {
	reqInfo := getReqInfo(c)

	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var params ProjectUpdatesParamsModel
	if err := c.BindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad Request Error"})
		return
	}

	if params.ProjectID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project not found"})
		return
	}

	var projectUpdates ProjectUpdatesModel
	// TODO - 2.1 Get project and updates with params, limit and offset.

	c.JSON(http.StatusOK, gin.H{"data": projectUpdates})
}

// Create deployment key
func createDeploymentKey(c *gin.Context) {
	reqInfo := getReqInfo(c)
	if reqInfo.UserID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}

	var payload CreateDeploymentKeyPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	key, err := GenerateSecureToken(15)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to generate deployment key"})
		return
	}

	expired, err := time.Parse("2006-01-02", payload.Expired)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse expired date into time.Time"})
		return
	}

	deploymentKey := DeploymentKey{
		Key:         key,
		UserID:      reqInfo.UserID,
		ProjectID:   payload.ProjectID,
		Expired:     expired,
		Environment: payload.Environment,
	}

	// Store metadata in DB
	db.Create(&deploymentKey)

	c.JSON(http.StatusOK, gin.H{
		"message": "Update uploaded successfully",
		"data":    deploymentKey,
	})
}

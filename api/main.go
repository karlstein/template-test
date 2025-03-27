package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	loadEnv(".env")
	initDB()
	initS3()

	router := gin.Default()
	router.Use(CORSMiddleware())
	setupRoutes(router)

	port := getEnv("SERVER_PORT", "3005")
	log.Printf("🚀 CodePush server running on port %s", port)

	if err := router.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

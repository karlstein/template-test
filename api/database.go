package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Database instance
var db *gorm.DB

func initDB() {
	host := getEnv("POSTGRES_HOST", "localhost")
	port := getEnv("POSTGRES_PORT", "5432")
	// user := getEnv("POSTGRES_USER", "codepush")
	user := getEnv("POSTGRES_USER", "postgres")
	// password := getEnv("POSTGRES_PASSWORD", "securepassword")
	password := getEnv("POSTGRES_PASSWORD", "")
	dbname := getEnv("POSTGRES_DB", "codepushdb")
	nomigrate := getEnv("POSTGRES_NOMIGRATE", "true")

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to PostgreSQL: %v, pass: %s", err, password)
		os.Exit(1)
	}

	// Auto-migrate schema
	if nomigrate == "false" {
		if err := db.AutoMigrate(&Update{}, &DeploymentKey{}, &Team{}); err != nil {
			log.Fatalf("❌ Failed to migrate database: %v", err)
		}
	}

	log.Println("✅ Connected to PostgreSQL successfully!")
}

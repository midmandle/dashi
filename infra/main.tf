terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "dashi-terraform-state"
    key            = "dashi/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "dashi-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

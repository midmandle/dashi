variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-1"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB events table"
  type        = string
  default     = "dashi-events"
}

variable "lambda_zip_path" {
  description = "Path to the ingestion-api Lambda deployment zip"
  type        = string
}

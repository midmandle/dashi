output "api_endpoint" {
  description = "Base URL of the deployed REST API"
  value       = "${aws_api_gateway_stage.prod.invoke_url}/events"
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB events table"
  value       = aws_dynamodb_table.events.name
}

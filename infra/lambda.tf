resource "aws_lambda_function" "ingestion_api" {
  function_name    = "dashi-ingestion-api"
  role             = aws_iam_role.ingestion_api.arn
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)
  handler          = "handler.handler"
  runtime          = "nodejs20.x"

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.events.name
    }
  }

  tags = {
    Project = "dashi"
  }
}

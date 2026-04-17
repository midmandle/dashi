resource "aws_api_gateway_rest_api" "dashi" {
  name = "dashi"
}

resource "aws_api_gateway_resource" "events" {
  rest_api_id = aws_api_gateway_rest_api.dashi.id
  parent_id   = aws_api_gateway_rest_api.dashi.root_resource_id
  path_part   = "events"
}

resource "aws_api_gateway_method" "post_events" {
  rest_api_id   = aws_api_gateway_rest_api.dashi.id
  resource_id   = aws_api_gateway_resource.events.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_events" {
  rest_api_id             = aws_api_gateway_rest_api.dashi.id
  resource_id             = aws_api_gateway_resource.events.id
  http_method             = aws_api_gateway_method.post_events.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.ingestion_api.invoke_arn
}

resource "aws_api_gateway_deployment" "dashi" {
  rest_api_id = aws_api_gateway_rest_api.dashi.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.events,
      aws_api_gateway_method.post_events,
      aws_api_gateway_integration.post_events,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "prod" {
  rest_api_id   = aws_api_gateway_rest_api.dashi.id
  deployment_id = aws_api_gateway_deployment.dashi.id
  stage_name    = "prod"
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ingestion_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dashi.execution_arn}/*/*"
}

variable "sqs_name"{
    description = "The name of the SQS"
    type    = string
    default = "cart_queue"
}

variable "lambda_name" {
  description = "The name of the first lambda function contacted by the API"
  type        = string
  default = "maf_first_lambda"
}

variable "lambda_get_models" {
  description = "The name of the first lambda function contacted by the API"
  type        = string
  default = "maf_get_models_by_component_type"
}
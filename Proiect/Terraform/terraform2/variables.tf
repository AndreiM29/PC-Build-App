variable "sqs_name1"{
    description = "The name of the first queue"
    type    = string
    default = "cart_queue"
}
variable "sqs_name2"{
    description = "The name of the second queue"
    type    = string
    default = "delivery_queue"
}

variable "lambda_name" {
  description = "The name of the first lambda function contacted by the API"
  type        = string
  default = "maf_first_lambda"
}

variable "lambda_get_models" {
  description = "The name of the lambda function that returns the name of all the models for a compoennt type"
  type        = string
  default = "maf_get_models_by_component_type"
}

variable "lambda_get_model" {
  description = "The name of the lambda function that returns the specs of a certain model"
  type        = string
  default = "maf_get_model_specifications"
}

variable "lambda_get_configurations" {
  description = "The name of the lambda function that returns the Configurations"
  type        = string
  default = "maf_get_configurations"
}
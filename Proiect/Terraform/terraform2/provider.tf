terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.61"
    }
  }

  required_version = ">= 1.2.0"
}

variable "aws_region" {
  default = "eu-west-1"
}

provider "aws" {
  region = var.aws_region
}

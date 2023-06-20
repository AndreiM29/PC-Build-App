//DynamoDB tables
//dynamodb table --Invetories

resource "aws_dynamodb_table" "motherboards-inventory" {
  name           = "MotherboardsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }

  tags = {
    Name        = "motherboards-inventory"
    Environment = "production"
  }
}


resource "aws_dynamodb_table" "cpus-inventory" {
  name           = "CPUsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "cpus-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "ram-inventory" {
  name           = "RAMInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "ram-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "storage-drives-inventory" {
  name           = "StorageDrivesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "storage-drives-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}

resource "aws_dynamodb_table" "cases-inventory" {
  name           = "CasesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }


  tags = {
    Name        = "cases-inventory"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "power-supplies-inventory" {
  name           = "PowerSuppliesInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }


  tags = {
    Name        = "power-supplies-inventory"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "gpus-inventory" {
  name           = "GPUsInventory"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  attribute {
    name = "Available"
    type = "N"
  }

  tags = {
    Name        = "gpus-inventory"
    Environment = "production"
  }

  global_secondary_index {
    name            = "AvailableIndex"
    hash_key        = "Available"
    projection_type = "ALL"
    read_capacity   = 0
    write_capacity  = 0
  }
}





//dynamodb table --Details

resource "aws_dynamodb_table" "motherboards-specifications" {
  name           = "MotherboardsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Socket Type"
    type = "S"
  }

  attribute  {
    name = "Chipset"
    type = "S"
  }

  attribute  {
    name = "RAM Type"
    type = "S"
  }

  attribute  {
    name = "RAM Speed"
    type = "S"
  }

  attribute  {
    name = "PCIe Slots"
    type = "S"
  }

  attribute  {
    name = "Storage Interfaces"
    type = "S"
  }


  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/

  tags = {
    Name        = "motherboards-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "cpus-specifications" {
  name           = "CPUsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Socket Type"
    type = "S"
  }

  attribute  {
    name = "Chipset"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "cpus-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "ram-specifications" {
  name           = "RAMSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Type"
    type = "S"
  }

  attribute  {
    name = "Speed"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "ram-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "storage-drives-specifications" {
  name           = "StorageDrivesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Interface"
    type = "S"
  }

  attribute  {
    name = "Form Factor"
    type = "S"
  }

  attribute  {
    name = "Capacity"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/
  tags = {
    Name        = "storage-drives-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "cases-specifications" {
  name           = "CasesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Other Specs"
    type = "S"
  }
*/

  tags = {
    Name        = "cases-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "power-supplies-specifications" {
  name           = "PowerSuppliesSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }
/*
  attribute  {
    name = "Wattage"
    type = "S"
  }

  attribute  {
    name = "Other Specs"
    type = "S"
  }*/

  tags = {
    Name        = "power-supplies-specifications"
    Environment = "production"
  }
}

resource "aws_dynamodb_table" "gpus-specifications" {
  name           = "GPUsSpecifications"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "Model"

  attribute {
    name = "Model"
    type = "S"
  }

  /*attribute  {
    name = "PCIe Slot"
    type = "S"
  }

  attribute  {
    name = "Power Supply"
    type = "S"
  }*/

  tags = {
    Name        = "gpus-specifications"
    Environment = "production"
  }

}

resource "aws_dynamodb_table" "configurations" {
  name           = "Configurations"
  billing_mode   = "PAY_PER_REQUEST"
  read_capacity  = 0
  write_capacity = 0
  hash_key       = "ID"

  attribute {
    name = "ID"
    type = "S"
  }

  tags = {
    Name        = "configurations"
    Environment = "production"
  }
}
Feature: Canvas delete modules
  Scenario: Delete modules
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "2" with the text "Welcome Step - module 2"
    When I modify message module "3" with the text "Welcome Step - module 3"
    Then The number of "Message" modules should be "3"
    # The Welcome step's first module cannot be deleted
    # since it has special rules
    When I attempt to delete the Welcome steps's first module
    Then The number of "Message" modules should be "3"
    When I open "Message" module "1"
    Then The message module text should be "Welcome to your Workflow!"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Welcome Step - module 2"
    When I close module details
    When I open "Message" module "3"
    Then The message module text should be "Welcome Step - module 3"
    When I close module details
    # The Welcome step's second module can be deleted
    # since it has special rules
    When I delete a message module in position "2"
    Then The number of "Message" modules should be "2"
    When I open "Message" module "1"
    Then The message module text should be "Welcome to your Workflow!"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Welcome Step - module 3"
    When I close module details
    # For other steps, modules all modules can be deleted, including the first module
    Then We see a step named "Send IA"
    When The inspector is opened for the "Send IA" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I delete a message module in position "1"
    Then The number of "Message" modules should be "2"
    When I delete a message module in position "2"
    Then The number of "Message" modules should be "1"
    When I delete a message module in position "1"
    Then The number of "Message" modules should be "0"
Feature: Canvas reorder modules
  Scenario: Reorder modules
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "2" with the text "Welcome Step - module 2"
    When I modify message module "3" with the text "Welcome Step - module 3"
    Then The number of "Message" modules should be "3"
    # In the Welcome step, there should be no reordering allowed
    # since it has special rules
    When I reorder message modules in position "2" to position "1"
    When I open "Message" module "1"
    Then The message module text should be "Welcome to your Workflow!"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Welcome Step - module 2"
    When I close module details
    When I open "Message" module "3"
    Then The message module text should be "Welcome Step - module 3"
    When I close module details
    # However, other modules in the welcome step can be reorderd
    When I reorder message modules in position "3" to position "2"
    When I open "Message" module "1"
    Then The message module text should be "Welcome to your Workflow!"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Welcome Step - module 3"
    When I close module details
    When I open "Message" module "3"
    Then The message module text should be "Welcome Step - module 2"
    When I close module details
    # For other steps, modules all modules can be reordered, including the first module
    Then We see a step named "Send IA"
    When The inspector is opened for the "Send IA" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "1" with the text "Send IA - module 1"
    When I modify message module "2" with the text "Send IA - module 2"
    When I modify message module "3" with the text "Send IA - module 3"
    Then The number of "Message" modules should be "3"
    When I reorder message modules in position "2" to position "1"
    When I open "Message" module "1"
    Then The message module text should be "Send IA - module 2"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Send IA - module 1"
    When I close module details
    When I open "Message" module "3"
    Then The message module text should be "Send IA - module 3"
    When I close module details
    When I reorder message modules in position "3" to position "2"
    When I open "Message" module "1"
    Then The message module text should be "Send IA - module 2"
    When I close module details
    When I open "Message" module "2"
    Then The message module text should be "Send IA - module 3"
    When I close module details
    When I open "Message" module "3"
    Then The message module text should be "Send IA - module 1"
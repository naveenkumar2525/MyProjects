Feature: Canvas update modules
  Scenario: Update modules
    Given Go to the main site
    When Change page to "Canvas"
    Then We see a step named "Welcome"
    When The inspector is opened for the "Welcome" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "1" with the text "Welcome Step - module 1"
    When I modify message module "2" with the text "Welcome Step - module 2"
    Then The number of "Message" modules should be "3"
    Then We see a step named "Send IA"
    When The inspector is opened for the "Send IA" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "2" with the text "Send IA - module 2"
    When I modify message module "1" with the text "Send IA - module 1"
    Then The number of "Message" modules should be "2"
    Then We see a step named "Main Menu"
    When The inspector is opened for the "Main Menu" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "1" with the text "Main Menu - module 1"
    When I modify message module "2" with the text "Main Menu - module 2"
    Then The number of "Message" modules should be "2"
    Then We see a step named "Thank you"
    When The inspector is opened for the "Thank you" step
    When I Drag and Drop the "Message" module
    When I Drag and Drop the "Message" module
    When I modify message module "1" with the text "Thank you - module 2"
    When I modify message module "2" with the text "Thank you - module 1"
    Then The number of "Message" modules should be "2"
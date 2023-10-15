Feature: Form Module Input Icon
  Scenario: Display Field Menu dropdown Icon
    Given Go to the main site
    When Change page to "Canvas"
    Then I select the first step
    Then Drag and Drop form module
    Then Select form module
    Then Drag and Drop Text from static elements
    Then I will display a dropdown component with the ellipsis-vertical icon
  Scenario: Display Field Menu dropdown closed state
    Given Go to the main site
    When Change page to "Canvas"
    Then I select the first step
    Then Drag and Drop form module
    Then Select form module
    Then Drag and Drop Text from static elements
    Then I will display a dropdown component with the ellipsis-vertical icon
    When I click on the closed Field Menu dropdown component
    Then The dropdown component will display the open state
    When I click anywhere off the open dropdown
    Then The dropdown component will go into the closed state
  Scenario: Display Select Step dropdown open state
    Given Go to the main site
    When Change page to "Canvas"
    Then I select the first step
    Then Drag and Drop form module
    Then Select form module
    Then Drag and Drop Text from static elements
    Then I will display a dropdown component with the ellipsis-vertical icon
    When I click on the closed Field Menu dropdown component
    Then The dropdown component will display the open state
    Then I will show the drop down header with the added text Field Menu
    Then I will display a toggle off menu item
    Then I will display a floppy-disk menu item
    Then I will see a divider line
    Then I will display the RED action trash-can
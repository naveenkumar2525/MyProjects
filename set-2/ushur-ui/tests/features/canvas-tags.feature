Feature: Tags Module
  Scenario: View Save to Tag Modal
    Given Go to the main site
    When Change page to "Canvas"
    Then I select the first step
    Then Drag and Drop form module
    Then Select form module
    Then Drag and Drop Text Input from form elements
    Then Open Save to Tag modal
    Then Close Save to Tag modal
    When I type a word prefixed with two consecutive flower brackets
    Then Show NoMatch component
    Then Open Create Tag Modal
    Then Close Create Tag modal
    Then Open Tag selection dropdown
    Then Close Tag selection dropdown
    Then Select a tag
    
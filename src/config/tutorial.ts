export const tutorialConfig={moveDistance:32,deliveredWood:20,targetHP:36};
export const tutorialSteps=['Select a worker','Move your worker','Deliver wood','Build barracks','Train a soldier','Attack the training target'] as const;
export const tutorialInstructions=[
 'Left-click a worker to select it. A gold ring shows selection.',
 'Right-click empty ground to move the worker at least 32 pixels.',
 'Right-click the forest with workers selected. Deliver 20 wood to the keep; carried wood is not spendable.',
 'Select a worker, click Build Barracks [B], then click a green site. Wait for construction to finish.',
 'Select the completed barracks and click Train Soldier. Training costs resources and takes gameplay time.',
 'Select your soldier, then right-click the red training target. It will wait for your attack.',
] as const;

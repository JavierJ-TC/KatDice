Hooks.once('diceSoNiceReady', (dice3d) => {
	dice3d.addSystem({id: "katdice", name: "Kat Dices"}, false);
	dice3d.addDicePreset({
		type: "d20",
		labels: "",
		modelFile: "modules/katdice/kat_d20.glb",
		system: "katdice"
	});
});
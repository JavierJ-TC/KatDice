Hooks.once('diceSoNiceReady', (dice3d) => {
	dice3d.addSystem({id: "wcube_kat", name: "Kat Dices"}, false);
	dice3d.addDicePreset({
		type: "d20",
		labels: "",
		modelFile: "modules/wcube/kat_d20.glb",
		system: "wcube"
	});
});
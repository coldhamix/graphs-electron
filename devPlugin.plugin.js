function devPlugin(graph, inputNodes) {
  return 'Hi I am a developer plugin';
}

window['plugins']['devPlugin'] = devPlugin;

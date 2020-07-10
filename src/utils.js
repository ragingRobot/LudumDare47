export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

/**
 * Sends dead player data to firebase to be saved and used for future game instances
 * @param {string} playerName the name of the player, ex: deadguy01
 * @param {array} gridLocation where the player died, as an x,y array, ex: [203, 45]
 * @param {string} spawnItem reference to what we spawn at their death location, ex: 'ghost'
 */
export const saveDeadPlayer = (playerName, gridLocation, spawnItem) => {
  firebase.firestore().collection("gridItems").add({
    ...{gridLocation},
    ...{playerName},
    ...{spawnItem},
    timeOfDeath: firebase.firestore.FieldValue.serverTimestamp()
  });
}
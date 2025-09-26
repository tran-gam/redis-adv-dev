export default function playerStateSingleton() {
  let instance = null;

  function createInstance() {
    const state = {
      isSwordEquipped: false,
      maxHealth: 3,
      health: 3,
      position: { x: 1600, y: 200 },
    };

    return {
      get() {
        //using spread operator to return a copy of the state object
        //ensures that modifications to the copy do not affect the original state
        return { ...state };
      },

      set(property, value) {
        state[property] = value;
      },
    };
  }

  //singleton
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}

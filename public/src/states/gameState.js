export default function gameStateSingleton() {
  let instance = null;

  function createInstance() {
    const state = {
      previousScene: null,
      overworldFire: false,
      chapterOneCompleted: false,
      chapterTwoCompleted: false,
      chapterThreeCompleted: false,
      chapterFourCompleted: false,
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

export default function playerStateSingleton() {
  let instance = null;

  function createInstance() {
    let isSwordEquipped = false;
    const maxHealth = 3;
    let health = maxHealth;
    let hasKey = false;
    let position = { x: 1600, y: 200 };

    return {
      setIsSwordEquipped(value) {
        isSwordEquipped = value;
      },
      getIsSwordEquipped: () => isSwordEquipped,
      getMaxHealth: () => maxHealth,
      setHealth(value) {
        health = value;
      },
      getHealth: () => health,
      setHasKey(value) {
        hasKey = value;
      },
      getHasKey: () => hasKey,
      setPosition(x, y) {
        position.x = x;
        position.y = y;
      },
      getPosition: () => position,
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

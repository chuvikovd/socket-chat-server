class Storage {
  usernames: string[]

  constructor() {
    this.usernames = []
  }

  exists(username: string) {
    return this.usernames.includes(username)
  }

  add(username: string) {
    this.usernames.push(username)
  }

  remove(username: string) {
    const index = this.usernames.indexOf(username)

    if (index < 0) return

    this.usernames = [
      ...this.usernames.slice(0, index),
      ...this.usernames.slice(index + 1),
    ]
  }
}

export default new Storage()

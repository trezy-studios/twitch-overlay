class UserList {
  /***************************************************************************\
    Local Properties
  \***************************************************************************/

  _users = []





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  addUser = user => {
    this.users.push(user)
  }

  findByID = id => this.users.find(user => (user.id === id))

  findByUsername = username => this.users.find(user => (user.username === username))

  getRandomUser = () => this.users[Math.floor(Math.random() * this.users.length)]





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get isEmpty () {
    return Boolean(this.users.length)
  }

  get userIDs () {
    return this._users.map(({ id }) => id)
  }

  get usernames () {
    return this._users.map(({ username }) => username)
  }

  get users () {
    return this._users
  }
}





module.exports = UserList

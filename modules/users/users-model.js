const { readFile, writeToFile } = require("../../shared/file-utils")
const filePath = "./data/users.json"

//read file
async function getAllUsers() {
    return readFile(filePath);
}

//find user by id
async function getUserById(userId) {
    if (!userId) throw new Error(`Cannot use ${userId} to get users`);
    const allUsers = await getAllUsers();
    const foundUser = allUsers.find((user) => user.id === userId);
    return foundUser;
}

//find user by email
async function getUserByEmail(userEmail) {
    if (!userEmail) throw new Error(`Cannot use ${userEmail} to get users`);
    const allUsers = await getAllUsers();
    const foundUser = allUsers.find((user) => user.email === userEmail);
    return foundUser;
}

//create user
async function addUser(newUser) {
    if (!newUser) throw new Error(`Cannot use ${userEmail} to get users`);
    const allUsers = await getAllUsers();
    newUser = { id: allUsers.length + 1, ...newUser };
    allUsers.push(newUser);
    await writeToFile(filePath, allUsers);
    return newUser;
}

//update user
async function updateUser(userId, updateUser) {
  if (!userId || !updateUser) {
    throw new Error(
      `Cannot use ${userId} & ${updateUser} to update user`
    );
  }
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((user) => user.id === userId);
  if (index < 0) throw new Error(`User ID ${userId} doesn't exist`);
  const updatedUser = { ...allUsers[index], ...updateUser };
  allUsers[index] = updatedUser;
  await writeToFile(filePath, allUsers);
  return updatedUser;
}

//delete user
async function deleteUser(userId) {
  if (!userId) throw new Error(`Cannot use ${userId} to delete user`);
  const allUsers = await getAllUsers();
  const index = allUsers.findIndex((user) => user.id === userId);
  if (index < 0) {
    throw new Error(`user Id ${userId} doesn't exist`, {
      cause: { status: 404 },
    });
  }
  const [deletedUser] = allUsers.splice(index, 1);
  await writeToFile(filePath, allUsers);
  return deletedUser;
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser
};

export const isAuthenticated = session => {
  if (!session.userId) {
    throw new Error("not authenticated");
  }
};
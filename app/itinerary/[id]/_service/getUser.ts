type User = {
    name: string;
    email: string;
    id: string;
  };
  
  export const getUserId= (): string | undefined => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return undefined;
  
    try {
      const user: User = JSON.parse(userStr);
      console.log("USER FROM GET USER SERVICE", user.id)
      return user.id;
    } catch (error) {
      console.error("Gagal parse user dari localStorage:", error);
      return undefined;
    }
  };
  
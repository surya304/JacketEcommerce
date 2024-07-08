function validateEmail(email) {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return "";
  }
  
  function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    return "";
  }
  

  function validateName(name) {
    if (name.length < 2) {
      return "Name must be at least 2 characters long";
    }
    return "";
  }
  


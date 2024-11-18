const bcrypt = require("bcrypt");
const userModel = require("./../models/user.model");


// ////////////////////////////////////////////  USER - CONTROLLERS  ///////////////////////////////////////////


exports.updateUser = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const id = String(req.user._id);

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.changeUserPassword = async (req, res, next) => {

  try{

    const { currentPassword, password, confirmPassword } = req.body;
    
    const id = String(req.user._id);

    const currentUser = await userModel.findById(id);

    if (!currentUser) {
      return res.status(401).json("There is no user with this id !");
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, String(currentUser.password));

    if (!isCurrentPasswordCorrect) {
      // return res.status(401).json({ message: "current password is not correct !" });
      return res.status(452).json({ message: "current password is not correct !" });
    }

    await userModel.changePasswordValidation_ByUser({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
}


// ////////////////////////////////////////////  ADMIN - CONTROLLERS  ///////////////////////////////////////////


// exports.getAllUsersByAdmin = async (req, res, next) => {
//   try{
//     const users = await userModel.find();
//     if (!users) {
//       return res.status(404).json("user not found !");
//     }

//     return res.status(200).json({status: 200, message: "users get successfully !", data: users});
    
//   }catch(error){
//     next(error);
//   }
// };


// exports.getAllUsersByAdmin = async (req, res, next) => {
//   try{

//     // const users = await userModel.find();

//     const page = Number(req.query.page) || 1;
//     // const itemsPerPage = 2;
//     const {itemsPerPage} = req.body;
//     const numberOfItems = await userModel.find().countDocuments();

//     const users = await userModel.find()
//       .skip((page-1)*itemsPerPage)
//       .limit(itemsPerPage);

//     const pagination = {
//       itemsPerPage: itemsPerPage,
//       currentPage: page,
//       nextPage: page + 1,
//       previousPage: page - 1,
//       hasNextPage: itemsPerPage * page < numberOfItems,
//       hasPreviousPage: page > 1,
//       lastPage: Math.ceil(numberOfItems / itemsPerPage),
//     };
    
//     if (!users) {
//       return res.status(404).json("user not found !");
//     }

//     return res.status(200).json({status: 200, message: "users get successfully !", data: users, pagination: pagination});
    
//   }catch(error){
//     next(error);
//   }
// };


// exports.getAllUsersByAdmin = async (req, res, next) => {
//   try{

//     const page = Number(req.query.page) || 1;
//     const {itemsPerPage , sortType} = req.body;
//     const numberOfItems = await userModel.find().countDocuments();

//     const selectedSortType = 
//       sortType === "name-asc" ? {name: 1} :
//       sortType === "name-desc" ? {name: -1} :
//       sortType === "username-asc" ? {username: 1} :
//       sortType === "username-desc" ? {username: -1} :
//       sortType === "email-asc" ? {email: 1} :
//       sortType === "email-desc" ? {email: -1} :
//       sortType === "createdAt-asc" ? {createdAt: 1} :
//       sortType === "createdAt-desc" ? {createdAt: -1} :
//       sortType === "updatedAt-asc" ? {updatedAt: 1} :
//       sortType === "updatedAt-desc" ? {updatedAt: -1} : 
//       {};

//     const users = await userModel.find()
//       .sort(selectedSortType)
//       .skip((page-1)*itemsPerPage)
//       .limit(itemsPerPage);

//     const pagination = {
//       itemsPerPage: itemsPerPage,
//       currentPage: page,
//       nextPage: page + 1,
//       previousPage: page - 1,
//       hasNextPage: itemsPerPage * page < numberOfItems,
//       hasPreviousPage: page > 1,
//       lastPage: Math.ceil(numberOfItems / itemsPerPage),
//     };
    
//     if (!users) {
//       return res.status(404).json("user not found !");
//     }

//     return res.status(200).json({status: 200, message: "users get successfully !", data: users, pagination: pagination, selectedSortType: sortType});
    
//   }catch(error){
//     next(error);
//   }
// };


// exports.getAllUsersByAdmin = async (req, res, next) => {
//   try{

//     const page = Number(req.query.page) || 1;
//     const {itemsPerPage , sortType , filterType} = req.body;

//     const selectedFilterType = 
//       filterType === "role-admin" ? {role: "ADMIN"} :
//       filterType === "role-user" ? {role: "USER"} :
//       filterType === "isBan" ? {isBan: true} :
//       filterType === "notIsBan" ? {isBan: false} :
//       {};

//     // const numberOfItems = await userModel.find().countDocuments();
//     const numberOfItems = await userModel.find(selectedFilterType).countDocuments();

//     const selectedSortType = 
//       sortType === "name-asc" ? {name: 1} :
//       sortType === "name-desc" ? {name: -1} :
//       sortType === "username-asc" ? {username: 1} :
//       sortType === "username-desc" ? {username: -1} :
//       sortType === "email-asc" ? {email: 1} :
//       sortType === "email-desc" ? {email: -1} :
//       sortType === "createdAt-asc" ? {createdAt: 1} :
//       sortType === "createdAt-desc" ? {createdAt: -1} :
//       sortType === "updatedAt-asc" ? {updatedAt: 1} :
//       sortType === "updatedAt-desc" ? {updatedAt: -1} : 
//       {};

//     const users = await userModel
//       // .find()
//       .find(selectedFilterType)
//       .sort(selectedSortType)
//       .skip((page-1)*itemsPerPage)
//       .limit(itemsPerPage);

//     const pagination = {
//       itemsPerPage: itemsPerPage,
//       currentPage: page,
//       nextPage: page + 1,
//       previousPage: page - 1,
//       hasNextPage: itemsPerPage * page < numberOfItems,
//       hasPreviousPage: page > 1,
//       lastPage: Math.ceil(numberOfItems / itemsPerPage),
//     };
    
//     if (!users) {
//       return res.status(404).json("user not found !");
//     }

//     return res.status(200).json({status: 200, message: "users get successfully !", data: users, pagination: pagination, selectedSortType: sortType, selectedFilterType: filterType});
    
//   }catch(error){
//     next(error);
//   }
// };


exports.getAllUsersByAdmin = async (req, res, next) => {
  try{

    const page = Number(req.query.page) || 1;

    const {itemsPerPage , sortType , filterType , searchPhrase} = req.body;

    const selectedFilterType = 
      filterType === "role-admin" ? {role: "ADMIN"} :
      filterType === "role-user" ? {role: "USER"} :
      filterType === "isBan" ? {isBan: true} :
      filterType === "notIsBan" ? {isBan: false} :
      {};

    // const numberOfItems = await userModel.find().countDocuments();
    // const numberOfItems = await userModel.find(selectedFilterType).countDocuments();
    const numberOfItems = await userModel
      .find({ username: { $regex: searchPhrase ? searchPhrase : "" , $options: "i" } })    // 'i' for case-insensitive search , 's' for case-sensitive search
      .find(selectedFilterType)
      .countDocuments();

    const selectedSortType = 
      sortType === "name-asc" ? {name: 1} :
      sortType === "name-desc" ? {name: -1} :
      sortType === "username-asc" ? {username: 1} :
      sortType === "username-desc" ? {username: -1} :
      sortType === "email-asc" ? {email: 1} :
      sortType === "email-desc" ? {email: -1} :
      sortType === "createdAt-asc" ? {createdAt: 1} :
      sortType === "createdAt-desc" ? {createdAt: -1} :
      sortType === "updatedAt-asc" ? {updatedAt: 1} :
      sortType === "updatedAt-desc" ? {updatedAt: -1} : 
      {};

    const users = await userModel
      // .find()
      .find({ username: { $regex: searchPhrase ? searchPhrase : "" , $options: "i" } })    // 'i' for case-insensitive search , 's' for case-sensitive search
      .find(selectedFilterType)
      .sort(selectedSortType)
      .skip((page-1)*itemsPerPage)
      .limit(itemsPerPage);

    const pagination = {
      itemsPerPage: itemsPerPage,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: itemsPerPage * page < numberOfItems,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfItems / itemsPerPage),
    };
    
    if (!users) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "users get successfully !", data: users, pagination: pagination, selectedSortType: sortType, selectedFilterType: filterType, searchPhrase: searchPhrase});
    
  }catch(error){
    next(error);
  }
};


exports.updateUserByAdmin = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const { id } = req.params;

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.createUserByAdmin = async (req, res, next) => {

  try {

    const { name , username, email, password, confirmPassword } = req.body;

    await userModel.registerValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const isUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: "USER",
    });

    if (!user) {
      return res.status(404).json("user not found !");
    }

    const userObject = user.toObject();

    Reflect.deleteProperty(userObject, "password");

    return res.status(201).json({status: 201, message: "user Created successfully !", data: userObject});

  } catch (error) {
    next(error);
  }
};


exports.changeUserRoleByAdmin = async (req, res, next) => {

  try{

    const { role } = req.body;

    const { id } = req.params;

    await userModel.changeRoleValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        role,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "role changed successfully !", data: user});

  }catch(error){
    next(error);
  }
}


exports.changeUserPasswordByAdmin = async (req, res, next) => {

  try{

    const { password, confirmPassword } = req.body;

    const { id } = req.params;

    await userModel.changePasswordValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
}


exports.removeUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.removeValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndDelete(
      id,
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user deleted successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.banUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.banValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isBan: true,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user banned successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.unbanUserByAdmin = async (req, res, next) => {

  try{

    const { id } = req.params;

    await userModel.unbanValidation({id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        isBan: false,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user unbanned successfully !", data: user});

  }catch(error){
    next(error);
  }

};
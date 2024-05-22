/* eslint-disable @typescript-eslint/no-explicit-any */
import { Close } from "@mui/icons-material";
import DefaultButton from "../../common/Buttons/DefaultButton";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import styles from "./UserList.module.scss";

interface Props {
  users: any;
  setUsers: any;
  setMainFormData: any;
  userType: "Reviewers" | "Approvers";
  isValid?: any;
  errorMsg?: string;
  formData: any;
}

const UserList = ({
  users,
  setUsers,
  userType,
  isValid,
  errorMsg,
  setMainFormData,
  formData,
}: Props): JSX.Element => {
  const objName = userType === "Approvers" ? "docApprovers" : "docReviewers";

  const handleRemoveUser = (index: number): void => {
    setUsers((prev: any) => {
      const updatedUsers = prev[objName].filter(
        (e: any, idx: number) => idx !== index
      );
      // Rearrange ids
      const updatedUsersWithIds = updatedUsers.map(
        (user: any, idx: number) => ({
          ...user,
          id: idx + 1,
        })
      );

      const updatedFormData = formData.map((item: any) =>
        item.key === objName ? { ...item, value: updatedUsersWithIds } : item
      );

      setMainFormData(updatedFormData);

      return {
        ...prev,
        [objName]: updatedUsersWithIds,
      };
    });
  };

  const validateUserData = (userData: any): boolean => {
    return (
      userData?.length !== 0 &&
      userData !== "" &&
      userData !== undefined &&
      userData !== null
    );
  };

  const handleAddUser = (): void => {
    setUsers((prev: any) => {
      const newUser = {
        id: prev[objName].length + 1,
        userData: "",
        isValid: true,
      };

      const updatedUsers = [...prev[objName], newUser];

      const updatedFormData = formData.map((item: any) =>
        item.key === objName ? { ...item, value: updatedUsers } : item
      );

      setMainFormData(updatedFormData);

      return {
        ...prev,
        [objName]: updatedUsers,
      };
    });
  };

  return (
    <>
      <div className={styles.usersContainer}>
        {users?.map((user: any, i: number) => (
          <div className={styles.usersCard} key={i}>
            {i !== 0 && (
              <Close
                onClick={() => handleRemoveUser(i)}
                className={styles.deleteUser}
              />
            )}
            <p className={styles.userCount}>
              {userType === "Reviewers"
                ? `Reviewer ${i + 1}`
                : `Approver ${i + 1}`}
            </p>
            <CustomPeoplePicker
              size="SM"
              errorMsg={"field can't be empty"}
              isValid={!user.isValid}
              key={i}
              onChange={(value: any) => {
                setUsers((prev: any) => {
                  const updatedUsers = prev[objName].map(
                    (item: any, index: number) =>
                      index === i
                        ? {
                            ...item,
                            userData: value,
                            isValid: !validateUserData(users[i].userData),
                          }
                        : item
                  );

                  const updatedFormData = formData.map((item: any) =>
                    item.key === objName
                      ? {
                          ...item,
                          value: updatedUsers,
                          isValid: formData.every((data: any) => data?.isValid),
                        }
                      : item
                  );

                  setMainFormData(updatedFormData);

                  return {
                    ...prev,
                    [objName]: updatedUsers,
                  };
                });
              }}
              placeholder="Enter here..."
            />
          </div>
        ))}
        <DefaultButton
          btnType="primaryGreen"
          text="Add"
          onClick={handleAddUser}
        />
      </div>
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
    </>
  );
};

export default UserList;

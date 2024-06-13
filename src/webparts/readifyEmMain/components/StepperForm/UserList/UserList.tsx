/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { Close } from "@mui/icons-material";
import DefaultButton from "../../common/Buttons/DefaultButton";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import styles from "./UserList.module.scss";
import { memo } from "react";

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
  const objName = userType === "Approvers" ? "approvers" : "reviewers";

  const handleRemoveUser = (index: number): void => {
    // Remove user by index
    const updatedUsers = users.filter((e: any, idx: number) => {
      return idx !== index;
    });
    // Rearrange ids
    const updatedUsersWithIds = updatedUsers.map((user: any, idx: number) => {
      return {
        ...user,
        id: idx + 1,
        userData: user.userData,
      };
    });

    // Update the formData
    const updatedFormData = formData.map((item: any) =>
      item.key === objName ? { ...item, value: updatedUsersWithIds } : item
    );

    setMainFormData(updatedFormData);
    setUsers((prev: any) => ({
      ...prev,
      [objName]: updatedUsersWithIds,
    }));
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
    const newUser = {
      id: users.length + 1,
      userData: "",
      isValid: true,
    };

    const updatedUsers = [...users, newUser];

    const updatedFormData = formData.map((item: any) =>
      item.key === objName ? { ...item, value: updatedUsers } : item
    );

    setMainFormData(updatedFormData);
    setUsers((prev: any) => ({
      ...prev,
      [objName]: updatedUsers,
    }));
  };

  return (
    <>
      <div className={styles.usersContainer}>
        {users?.map((user: any, i: number) => {
          return (
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
                errorMsg={"Field can't be empty"}
                isValid={!user.isValid}
                // key={i}
                selectedItem={
                  user?.userData?.[0]?.secondaryText || user?.userData?.EMail
                }
                onChange={(value: any) => {
                  const updatedUsers = users?.map((item: any, index: number) =>
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
                          isValid: !formData.every(
                            (data: any) => data?.isValid
                          ),
                        }
                      : item
                  );

                  setUsers((prev: any) => {
                    setMainFormData(updatedFormData);

                    return {
                      ...prev,
                      [objName]: updatedUsers,
                    };
                  });
                }}
                placeholder="Add people"
              />
            </div>
          );
        })}
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

export default memo(UserList);

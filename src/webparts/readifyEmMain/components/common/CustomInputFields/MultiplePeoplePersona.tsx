/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { Persona, PersonaSize } from "@fluentui/react";
import styles from "./Inputs.module.scss";

interface Props {
  data?: any;
  positionLeft: number;
}

const CustomMutiplePeoplePersona: React.FC<Props> = ({
  data,
  positionLeft,
}) => {
  return (
    <>
      <div className={styles.personaSection}>
        {data?.map((person: any, index: number) => {
          return (
            <Persona
              styles={{
                root: {
                  margin: "0 !important;",
                  position: "absolute",
                  borderRadius: "10px",
                  border: "3px solid #fff",
                  left: `${positionLeft * index}px`,
                  zIndex: `${index}`,
                  // ".ms-Persona ": {
                  //   Position: "absolute",
                  //   borderRadius: "10px",
                  //   border: "3px solid #fff",
                  //   left: `${positionLeft * index}px`,
                  //   zIndex: `${index}`,
                  // },
                  ".ms-Persona-details": {
                    display: "none",
                  },
                  ".ms-Persona-image": {
                    width: "20px !important",
                    height: "20px !important",
                  },
                },
              }}
              imageUrl={
                "/_layouts/15/userphoto.aspx?size=S&username=" + person.email
              }
              title={person.name}
              size={PersonaSize.size24}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
};

export default memo(CustomMutiplePeoplePersona);

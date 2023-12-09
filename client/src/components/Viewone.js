import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const ViewOne = () => {
  const { user, setAlertMessage, handleSnackType } = useOutletContext();
  const { id } = useParams();
  const [craft, setCraft] = useState({});
  const [hasCraft, setHasCraft] = useState(false);
  const {
    image,
    title,
    description,
    instructions,
    difficulty,
    materials,
    witches,
  } = craft;

  const check_user_craft = () => {
    const user_has_craft = witches?.find(
      (witch) => witch["username"] === user.username
    );
    if (user_has_craft) {
      return setHasCraft(true);
    }
  };

  useEffect(() => {
    fetch(`/crafts/${id}`)
      .then((resp) => resp.json())
      .then((craftObj) => {
        setCraft(craftObj);
      })
      .catch((errorObj) => {
        handleSnackType("error");
        setAlertMessage(errorObj.message);
      });
  }, [id, witches]);

  useEffect(() => {
    if (user && craft.witches) {
      check_user_craft();
    }
  }, [user, witches]);

  const handleSaveCraft = () => {
    if (user) {
      fetch("/witch_crafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ craft_id: id }),
      })
        .then((resp) => {
          if (resp.ok) {
            resp.json().then(() => {
              handleSnackType("success");
              setAlertMessage("Craft added!");
              setHasCraft(true);
            });
          } else {
            resp.json().then((errObj) => {
              handleSnackType("error");
              setAlertMessage(errObj.message);
            });
          }
        })
        .catch((errorObj) => {
          handleSnackType("error");
          setAlertMessage(errorObj.message);
        });
    } else {
      handleSnackType("error");
      setAlertMessage("Must be logged in to save Craft!");
    }
  };

  const handleDeleteCraft = (id) => {
    fetch(`/witch_crafts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        handleSnackType("success");
        setAlertMessage("Craft removed!");
        setHasCraft(false);
      })
      .catch((errorObj) => {
        handleSnackType("error");
        setAlertMessage(errorObj.message);
      });
  };

  const materials_list = materials?.map((material) => (
    <li key={material["name"]}>{material["name"]}</li>
  ));
  const witch_list = witches?.map((witch) => (
    <li key={witch["username"]}>{witch["username"]}</li>
  ));

  return (
    <div className="one_craft">
      <img src={image} alt={title} />

      <div className="container">
        <main className="craft_details">
          <h2>{title}</h2>
          <p className="subtle">{difficulty}</p>
          <p>{description}</p>
          <p>{instructions}</p>
          <ul>{materials_list}</ul>
          {hasCraft ? (
            <button onClick={() => handleDeleteCraft(craft.id)}>
              Remove craft
            </button>
          ) : (
            <button onClick={handleSaveCraft}>Save craft</button>
          )}
        </main>
        <aside>
          <h3>Coven Crafters:</h3>
          <ul>{witch_list}</ul>
        </aside>
      </div>
    </div>
  );
};

export default ViewOne;

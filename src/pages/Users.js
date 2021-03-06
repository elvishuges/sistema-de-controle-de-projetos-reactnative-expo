import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import userActions from "./../actions/user.actions";
import DispatchContext from "../contexts/dispatch.context";

import DeveloperCardProfile from "../components/DeveloperCardProfile";
import TableDevelopersHours from "../components/TableDevelopersHours";

const { width } = Dimensions.get("window");

export default function Users() {
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const dispatch = React.useContext(DispatchContext);

  const imageVue = {
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_eqlWTAYpKq2K2qi1aKLydJbnkjHZvUePGA&usqp=CAU",
  };
  const imageReactNative = {
    uri: "https://cdn.evilmartians.com/front/posts/optimizing-react-virtual-dom-explained/cover-a1d5b40.png",
  };

  useEffect(() => {
    async function fetchAPI() {
      let responseUsers = await userActions.getAllUsers(dispatch);
      let responseHours = await userActions.getAllHours(dispatch);
      let responseProjects = await userActions.getAllProjects(dispatch);

      formatDataTableRows(responseHours, responseUsers, responseProjects);
      setLoadingData(false);
      responseUsers.forEach(
        (element, index) =>
          (element.imageUrl = index % 2 === 0 ? imageVue : imageReactNative)
      );
      setUsers(responseUsers);
    }

    fetchAPI();
  }, []);
  const formatDataTableRows = (hours, users, projects) => {
    let dataTableRows = [];
    hours.forEach((hour) => {
      let project = projects.find((project) => project._id === hour.project);
      let user = users.find((user) => user._id === hour.user);

      if (project) {
        let tableElement = {
          project: project.name,
          hours: hour.hours,
          day: hour.day,
          user: user ? user.name : "--",
          active: project.active,
        };
        dataTableRows.push(tableElement);
      }
    });

    setTableData(dataTableRows);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.titleProject}>Desenvolvedores:</Text>
      <View style={styles.viewScroll}>
        {loadingData && (
          <ActivityIndicator
            style={styles.activator}
            animating={loadingData}
            style={[{ height: 80 }]}
            color="#C00"
            size="large"
            hidesWhenStopped={false}
          />
        )}
        <ScrollView
          horizontal={true}
          decelerationRate={0}
          snapToInterval={width - 60}
          snapToAlignment={"center"}
        >
          {users.map((user, i) => {
            return <DeveloperCardProfile key={user._id} user={user} />;
          })}
        </ScrollView>
      </View>
      <Text style={styles.titleProject}>Detalhes de projeto:</Text>
      <ScrollView style={styles.scrollView}>
        <TableDevelopersHours loadingData={loadingData} tableData={tableData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    paddingHorizontal: 3,
  },
  scrollView: {
    flexGrow: 1,
  },
  viewScroll: {
    height: "25%",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flexGrow: 1,
  },
  titleProject: {
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  activator: {
    alignItems: "center",
    justifyContent: "center",
  },
});

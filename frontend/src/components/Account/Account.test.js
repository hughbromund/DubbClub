import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";

import Account from "./Account";

test("renders without crashing", () => {
  shallow(<Account />);
  const div = document.createElement("div");
  ReactDOM.render(<Account />, div);
});

test("initial values set properly", () => {
  const wrapper = shallow(<Account />);

  const componentInstance = wrapper.instance();

  const mockState = {
    username: "",
    email: "",
    newEmail: "",
    newPassword: "",
    newPasswordConfirm: "",
    error: "",
  };

  expect(componentInstance.state).toStrictEqual(mockState);
});

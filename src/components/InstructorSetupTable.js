import "./InstructorSetupTable.css";
import React from "react";
import plusIcon from "../assets/svg/plus-icon.svg";

export default function InstructorSetupTable() {
  return (
    <table className="roster-table">
      <thead>
        <tr className="table-title">
          <th colSpan={3} style={{ fontWeight: "normal" }}>
            Current Roster
          </th>
          <th style={{ textAlign: "end", paddingRight: "0.75rem" }}>
            Instructors
          </th>
        </tr>
        <tr className="table-headers">
          <th>Last Name</th>
          <th>First Name</th>
          <th>Expertise</th>
          <th>Maximum Load</th>
        </tr>
      </thead>

      <tbody>
        <tr className="table-data">
          <td>Doe</td>
          <td>John</td>
          <td>
            <ul>
              <li> Software Development</li>
              <li> Cryptography</li>
            </ul>
          </td>
          <td>60%</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={4}>
            <button className="add-instructor-btn">
              <img src={plusIcon} alt="plus" />
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

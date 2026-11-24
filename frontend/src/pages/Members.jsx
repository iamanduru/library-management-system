
import { useId, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import "../styles/members.css";

const emptyMember = {
  fullName: "",
  email: "",
  role: "",
};

function MemberForm({
  mode,
  values,
  onChange,
  onSubmit,
  onCancel,
}) {
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();

  return (
    <section
      className="members-form-panel"
      aria-labelledby="member-form-heading"
    >
      <div className="members-form-heading">
        <div>
          <h2 id="member-form-heading">
            {mode === "edit" ? "Edit member" : "Add new member"}
          </h2>
          <p>
            {mode === "edit"
              ? "Update the member's information."
              : "Register a new student or staff member."}
          </p>
        </div>

        <button
          type="button"
          className="members-close-button"
          onClick={onCancel}
          aria-label="Close member form"
        >
          ×
        </button>
      </div>

      <form className="members-form" onSubmit={onSubmit}>
        <div className="members-form-grid">
          <div className="members-field">
            <label htmlFor={nameId}>Full name</label>
            <input
              id={nameId}
              type="text"
              name="fullName"
              value={values.fullName}
              onChange={onChange}
              placeholder="e.g. Faith Mutheu"
              autoComplete="name"
              maxLength={120}
              required
              autoFocus
            />
          </div>

          <div className="members-field">
            <label htmlFor={emailId}>Email address</label>
            <input
              id={emailId}
              type="email"
              name="email"
              value={values.email}
              onChange={onChange}
              placeholder="faith.mutheu@example.com"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>

          <div className="members-field">
            <label htmlFor={roleId}>Member role</label>
            <select
              id={roleId}
              name="role"
              value={values.role}
              onChange={onChange}
              required
            >
              <option value="">Select a role</option>
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        <div className="members-form-actions">
          <button
            type="button"
            className="members-secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="members-primary-button"
            disabled={
              !values.fullName.trim() ||
              !values.email.trim() ||
              !values.role
            }
          >
            {mode === "edit" ? "Save changes" : "Save member"}
          </button>
        </div>
      </form>
    </section>
  );
}

function MemberRole({ role }) {
  return (
    <span
      className={`members-role ${
        role === "STAFF"
          ? "members-role-staff"
          : "members-role-student"
      }`}
    >
      {role === "STAFF" ? "Staff" : "Student"}
    </span>
  );
}

export default function Members() {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
  } = useLibrary();

  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyMember);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const query = search.trim().toLowerCase();

  const filteredMembers = members.filter((member) =>
    [
      member.fullName,
      member.email,
      member.role,
    ].some((value) => value.toLowerCase().includes(query))
  );

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setFormValues({ ...emptyMember });
    setDeletingId(null);
    setFeedback("");
  }

  function openEditForm(member) {
    setFormMode("edit");
    setEditingId(member.id);
    setFormValues({
      fullName: member.fullName,
      email: member.email,
      role: member.role,
    });
    setDeletingId(null);
    setFeedback("");
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setFormValues({ ...emptyMember });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const memberData = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      role: formValues.role,
    };

    if (
      !memberData.fullName ||
      !memberData.email ||
      !["STUDENT", "STAFF"].includes(memberData.role)
    ) {
      return;
    }

    if (formMode === "edit") {
      updateMember(editingId, memberData);
      setFeedback("Member updated successfully.");
    } else {
      addMember(memberData);
      setFeedback("Member added successfully.");
    }

    closeForm();
  }

  function handleDelete(member) {
    deleteMember(member.id);
    setDeletingId(null);
    setFeedback(`${member.fullName} was removed.`);

    if (editingId === member.id) {
      closeForm();
    }
  }

  return (
    <div className="members-page page-enter">
      <header className="members-header">
        <div>
          <h1>Members</h1>
          <p>
            Manage registered students and staff in your library.
          </p>
        </div>

        <button
          type="button"
          className="members-primary-button"
          onClick={openCreateForm}
        >
          <span aria-hidden="true">+</span>
          Add member
        </button>
      </header>

      {feedback && (
        <p className="members-feedback" role="status">
          {feedback}
        </p>
      )}

      {formMode && (
        <MemberForm
          mode={formMode}
          values={formValues}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      <section
        className="members-table-panel"
        aria-label="Member records"
      >
        <div className="members-toolbar">
          <div className="members-search">
            <label
              htmlFor="member-search"
              className="members-sr-only"
            >
              Search members
            </label>

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>

            <input
              id="member-search"
              type="search"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <span className="members-count">
            {filteredMembers.length}
            {filteredMembers.length === 1
              ? " member"
              : " members"}
          </span>
        </div>

        <div className="members-table-scroll">
          <table className="members-table">
            <thead>
              <tr>
                <th scope="col">Full name</th>
                <th scope="col">Email address</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="members-empty">
                    {search
                      ? "No members match your search."
                      : "No members yet. Add your first member."}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="members-name-cell">
                      {member.fullName}
                    </td>

                    <td>{member.email}</td>

                    <td>
                      <MemberRole role={member.role} />
                    </td>

                    <td>
                      <div className="members-row-actions">
                        <button
                          type="button"
                          className="members-text-button"
                          onClick={() => openEditForm(member)}
                          aria-label={`Edit ${member.fullName}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="members-text-button members-danger"
                          onClick={() => {
                            setDeletingId(member.id);
                            setFeedback("");
                          }}
                          aria-label={`Delete ${member.fullName}`}
                        >
                          Delete
                        </button>
                      </div>

                      {deletingId === member.id && (
                        <div
                          className="members-confirm"
                          role="group"
                          aria-label={`Confirm deletion of ${member.fullName}`}
                        >
                          <span>Remove this member?</span>

                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            className="members-danger"
                            onClick={() => handleDelete(member)}
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

function ReorderList (props) {
  // Takes an array as props and adds reorder functionality to it
  // props - recipe object - array - array name (key) - callback function to update state
  function handleDragStart (e) {
    let id = e.target.id;
    e.dataTransfer.setData('text', id);
  }
  function handleAllowDrop (e) {
    e.preventDefault();
  }
  function handleDrop (e) {
    e.preventDefault();
    let originalId = e.dataTransfer.getData('text');
    let recipe = props.recipe;
    let arrayName = props.arrayName;
    let array = recipe[arrayName];
    let draggedText = array.splice(originalId, 1)[0];
    array.splice(e.target.id, 0, draggedText);
    recipe[arrayName] = array;
    props.handleStateUpdate(recipe);
  }

  function handleDelete (arrayName, index) {
    let array = props.recipe[arrayName];
    let recipe = props.recipe;
    array.splice(index, 1);
    recipe[arrayName] = array;
    props.handleStateUpdate(recipe);
  }

  let array = props.array || [0, 1, 2, 3, 4];

  let items = array.map((item, index) => {
    return (
      <tr className="list-item" id={index} draggable onDragStart={handleDragStart} onDragOver={handleAllowDrop} onDragEnter={handleAllowDrop} onDrop={handleDrop} key={index}>
        <td><i className="fa fa-arrows"></i></td>
        <td>{item}</td>
        <td><i className="fa fa-pencil" title="edit" onClick={() => props.handleEdit(props.arrayName, item, index)}></i></td>
        <td><i className="fa fa-trash" title="delete" onClick={() => handleDelete(props.arrayName, index)}></i></td>
      </tr>
    )
  });
  return (
    <div className="reorder-list">
      <table>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  );

}

export default ReorderList;

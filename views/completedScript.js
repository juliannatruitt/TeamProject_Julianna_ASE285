$(document).ready(function () {
    // Add click event listener to todo titles
    $('.todo-title').click(function () {
      var postId = $(this).data('id');
      // Toggle the 'completed' class to apply or remove strikethrough style
      $(this).toggleClass('completed');
  
      // Perform an AJAX POST request to update the todo item as completed
      $.ajax({
        method: 'POST',
        url: '/complete',
        data: { postId: postId }, // Send the postId in the request body
        success: function () {
          console.log('Todo item marked as completed');
        },
        error: function (xhr, status, error) {
          console.error(error);
        }
      });
    });
  });
  
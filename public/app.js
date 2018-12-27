$.get("/news", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#news").append(
      `
      <div data-id='${data[i]._id}'class='card news'>
        <h5 data-id='${data[i]._id}' class='card-header'>${data[i].title}</h5>
        <div class='card-body'>
          <h5 class='card-title'>${data[i].description} </h5>
          <a class='card-text' href="${data[i].url}">Mas información -></a>
          <div class='form-group'><label for='comment'>Make a Comment</label><input  type='text' class='form-control' class='comment' placeholder='Comment'> </div>
          <a id='submit' data-id='${
            data[i]._id
          }' href='#' class='btn btn-primary'>Submit</a>
        </div>
      </div><br /> <br /> <br />
      `
    )
  }
})
$(document).on("click", ".news", function() {
  $("#comments").empty()
  var thisId = $(this).attr("data-id")
  $(`div[data-id="${thisId}"] input[type=text]`).val("")
  $.ajax({
    method: "GET",
    url: "/news/" + thisId
  }).then(function(data) {
    var comments = data.comments
    comments.forEach(function(comment) {
      var id = comment._id

      $("#comments").append(`<span data-id='${id}'><div class="card">
      <div class="card-body"><p class="card-text">${comment.comment}</p>
      <a href="#" data-id='${id}' id='delete'class="btn btn-danger">Delete</a>
      </div>
    </div></span><br>`)
    })
  })
})
$(document).on("click", "#delete", function() {
  var commentId = $(this).attr("data-id")
  $.ajax({
    method: "GET",
    url: "/delete/" + commentId,
    data: {
      _id: commentId
    }
  }).then(function() {
    var tessst = $(`span[data-id="${commentId}"] `)
    // console.log(tessst)
    $(`span[data-id="${commentId}"]`).remove()
  })
})
$(document).on("click", "#submit", function() {
  var newsId = $(this).attr("data-id")
  var usercomment = $(`div[data-id="${newsId}"] input[type=text]`).val()

  console.log(usercomment)
  $.ajax({
    method: "POST",
    url: "/news/" + newsId,
    data: {
      comment: usercomment
    }
  }).then(function(data) {})
})

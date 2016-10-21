// 	try {
// 		var repoUrl = 'https://api.github.com/users/YOUR_USERNAME/repos?access_token=' + access_token
// 		var profileUrl = 'https://api.github.com/users/YOUR_USERNAME?access_token=' + access_token
// 	}
// 	catch {
// 		var repoUrl = 'https://api.github.com/users/YOUR_USERNAME/repos'
// 		var profileUrl = 'https://api.github.com/users/YOUR_USERNAME'
// 	}
//
// 	var access_token = 'abc123'


// define the API URL with it's properties and values
var gitBaseUrl = "https://api.github.com/users/",
	gitProfile = "https://api.github.com/users/matthiasak?",
	gitRepos = "https://api.github.com/users/matthiasak/repos?",
	profileNode = document.querySelector("#profile"),
	reposNode = document.querySelector("#repos ul"),
	searchNode = document.querySelector("input#search"),
	enter = 13
	//github token remove
	try {
		var accessToken = "access_token=" + the_token
	}
	catch (error) {
		var accessToken = ""	
	}

var dateBuilder = function(dateInput) {
	var dateNew = new Date(dateInput),
		months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

	newDate = months[dateNew.getMonth()] + " " + dateNew.getDay() + ", " + (1900 + dateNew.getYear())
	return newDate
}

var profileBuilder = function(profileArray) {

	var htmlString =""

	htmlString += '<div class="profile_section">'
	htmlString += '<img src="' + profileArray.avatar_url + '" />'
	htmlString += '<div class="profile_main"><h1>'
	htmlString += profileArray.name ? '<span class="profile_name"><a href="' + profileArray.html_url + '">' + profileArray.name + '</a></span>' : ""
	htmlString += '<span class="profile_user"><a href="' + profileArray.html_url + '">' + profileArray.login + '</a></span></h1>'
	htmlString += profileArray.bio ? '<p class="bio">' + profileArray.bio + '</p>' : ""
	htmlString += '</div></div><div class="profile_section">'
	htmlString += '<ul>'
	htmlString += profileArray.company ? '<li class="company icon-users">' + profileArray.company + '</li>' : ""
	htmlString += profileArray.location ? '<li class="location icon-location">' + profileArray.location + '</li>' : ""
	htmlString += profileArray.email ? '<li class="email icon-envelope"><a href="mailto:' + profileArray.email + '">' + profileArray.email + '</a></li>' : ""
	htmlString += profileArray.blog ? '<li class="blog icon-browser"><a href="' + profileArray.blog + '">' + profileArray.blog + '</a></li>' : ""
	htmlString += profileArray.created_at ? '<li class="creation_date icon-clock">Joined on ' + dateBuilder(profileArray.created_at) + '</li>' : ""
	htmlString += '</ul>'
	htmlString += '</div>'

	profileNode.innerHTML = htmlString

}

var repoBuilder = function(reposArray) {

	reposNode.innerHTML = ""
	console.log(reposArray)

	for ( var i = 0; i < reposArray.length; i++ ) {

		repo = reposArray[i]
	
		var htmlString =""
		htmlString += '<li class="repo">'
		htmlString += '<div class="repo_name ' + repo.name + '"><a href="' + repo.html_url + '">' + repo.name + '</a>'
		htmlString += repo.description ? '<p>' + repo.description + '</p>' : ""
		htmlString += '</div>'
		htmlString += '<div class="' + 'repo_activity' + '">' + 'repo_activity' + '</div>'
		htmlString += repo.language ? '<div class="repo_language ' + repo.language + '"><span></span>' + repo.language + '</div>' : '<div class="repo_language"></div>'
		htmlString += '<div class="repo_stars ' + repo.stargazers_count + '"><span class="icon-heart">' + repo.stargazers_count + '</span></div>'
		htmlString += '</li>'

		reposNode.innerHTML += htmlString

	}

}

var profileResponseHandler = function(apiResponse) {
	htmlString = profileBuilder(apiResponse)
	console.log(apiResponse)
}

var reposResponseHandler = function(apiResponse) {
	htmlString = repoBuilder(apiResponse)
}

var profileErrorHandler = function() {
	profileNode.innerHTML = '<h2>Whoops!</h2><p>We were unable to locate the user you\'re searching for. Maybe try the Yellow Pages?</p>'
}

var fetchProfile = function(searchQuery) {
	var url = ""
	searchQuery ? url = searchQuery : url = gitProfile + accessToken
	var promise = $.getJSON(url)
	promise.then(profileResponseHandler,profileErrorHandler)
}

var reposErrorHandler = function() {
	reposNode.innerHTML = '<p>No public repos found.</p>'
}

var fetchRepos = function(searchQuery) {
	var url = ""
	searchQuery ? url = searchQuery : url = gitRepos + accessToken
	var promise = $.getJSON(url)
	promise.then(reposResponseHandler,reposErrorHandler)
}

var searchUsers = function(keyPressed) {
	if ( keyPressed.keyCode == enter ) {
		var userQuery = event.target.value
		try {
			profileSearchQuery = gitBaseUrl + userQuery + "?" + accessToken
			reposSearchQuery = gitBaseUrl + userQuery + "/repos?" + accessToken
		}
		catch (error) {
			profileSearchQuery = gitBaseUrl + userQuery
			reposSearchQuery = gitBaseUrl + userQuery + "/repos"
		}
		fetchProfile(profileSearchQuery)
		fetchRepos(reposSearchQuery)
		event.target.value = ""
	}
}

fetchRepos()
fetchProfile()

searchNode.addEventListener('keydown', searchUsers)
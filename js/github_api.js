function fetch_repositories() {
    var deferred = new $.Deferred();
    var repositories = [];

    $.get('https://api.github.com/users/Yucked/repos')
        .done(function (data) {
            $.each(data, function (_, value) {
                var repository = {};
                repository.name = value.name;
                repository.description = value.description;
                repository.url = value.html_url;
                repository.forks = value.forks;
                repository.stargazers = value.stargazers_count;

                $.get(value.languages_url)
                    .done(function (data) {
                        repository.languages = data;
                    })
                    .fail(function () {
                        repository.languages = value.language;
                        console.log('Errored when trying to languages information.');
                    });

                repositories.push(repository);
            });

            deferred.resolve(repositories);
        })
        .fail(function () {
            console.log('Errored when trying to get repositories.');
            deferred.reject();
        });

    return deferred.promise();
}

function build_repository_html(repositories) {
    let colors = ['is-light-pink', 'is-light-blue', 'is-light-green', 'is-light-grey', 'is-light-peach'];
    repositories
        .done(function (data) {
            $.each(data, function (_, value) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                var template = $('#repository_template').clone();
                template.find('#title').text(value.name);
                template.find('#description').text(value.description);
                template.find('#languages').text(value.languages);
                template.find('#stars').text(value.stargazers);
                template.find('#forks').text(value.forks);
                template.find('#url').attr('href', value.url);
                template.addClass(color);
                $('#repository_container').append(template.html());
            });
        })
        .fail(function () {
            $('#repository_error').removeClass('is-hidden');
        });
}
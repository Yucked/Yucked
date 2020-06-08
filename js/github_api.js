function fetchRepositories() {
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
                        var languages = Object.keys(data);
                        if (languages === undefined) {
                            repository.languages = value.language;
                        } else {
                            repository.languages = languages;
                        }
                    })
                    .fail(function () {
                        repository.languages = value.language;
                        console.log('Errored when trying to languages information.');
                    });

                if (repository.language === null) {
                    repository.language = 'Undefined';
                }
                repositories.push(repository);
            });

            deferred.resolve(repositories);
        })
        .fail(function () {
            // createError('#repository_container', '👾❗😭 Failed to load repositories.');
            deferred.reject();
        });

    return deferred.promise();
}

function createRepositoriesHtml(repositories) {
    let colors = ['is-light-pink', 'is-light-blue', 'is-light-green', 'is-light-grey', 'is-light-peach'];
    repositories
        .done(function (data) {
            let repos = data.filter(repo => repo.stargazers != 0);

            $.each(repos, function (_, value) {
                var color = colors[Math.floor(Math.random() * colors.length)];
                var template = $('#repository_template').clone();
                template.find('#title').text(value.name);
                template.find('#description').text(value.description);
                template.find('#languages').text('🕹️ Languages: ' + value.languages);
                template.find('#stars').text('⭐ Stars: ' + value.stargazers);
                template.find('#forks').text('🥢 Forks: ' + value.forks);
                template.find('#url').attr('href', value.url);
                template.children(":first").addClass(color);

                $('#repository_container').append(template.html());
            });
        })
        .fail(function () {
            createError('#repository_container', '👾❗😭 Failed to load repositories.');
        });
}

function getProfileInformation() {
    $.get('https://api.github.com/users/Yucked')
        .done(function (data) {
            $('#profileCol').find('#login').html('<b>' + data.login + '</b>' + ' | <code>' + data.company + '</code>');
            $('#profileCol').find('#bio').text(data.bio);
            $('#profileCol').find('#stats').html('<b>{0} Repos</b> | <b>{1} Gists</b> | <b>{2} Followers</b>'.format(data.public_repos, data.public_gists, data.followers));
            $('#profileImg').attr('src', data.avatar_url);
            $('#profile_container').children(":first").removeClass('is-hidden');
        })
        .fail(function () {
            createError('#profile_container', '👾❗😭 Failed to load profile information.');
        });
}
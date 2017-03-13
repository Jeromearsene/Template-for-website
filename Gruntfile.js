const _image = 'Ressources/images/'
// Attention ! L'image ne doit pas contenir d'espaces
const _favicon = 'Ressources/favicons/'
const _JS = 'JS/'
const _stylus = 'Stylus/'
const _CSS = 'CSS/'
const _header = "Sections/header.php"

const lienDuSiteATester = ''

const separateurDeConcatenation = '\n \n'





/*---------------------------------------------------------------------------------*/






module.exports = grunt =>
{
    // Donne des informations sur le temps d'execution des taches grunt
    require('time-grunt')(grunt);

    // Charge automatiquement les taches grunt requises sans avoir besoin d'y faire appel
    require('jit-grunt')(grunt);


    grunt.initConfig({

        // Watchers pour executer des tasks quand des changements se produisent
        watch: {
            images: {
                files: [_image+'**/*'],
                tasks: ['minifyImages'],
            },
            stylus: {
                files: [_stylus+'**/*'],
                tasks: ['stylus'],
                options: {
                    livereload: true,
                }
            },
        },
        
        

        // Permet de recevoir des notifications quand certaines tâches sont finis
        notify: {
            cssmin: {
                options: {
                    title: 'Task Complete',
                    message: 'CSS minified ✅!',
                    duration: 2.5
                }
            },
            postcss: {
                options: {
                    title: 'Task Complete',
                    message: 'Prefixe CSS added ✅!',
                    duration: 2.5
                }
            }
        },





        // Réduit la taille des images
        tinyimg: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: _image,
                    src: ['**/*.{png,jpg,gif,jpeg}'],
                    dest: _image
                }]
            }
        },



        // Concatene tous les fichiers JS en un seul
        concat: {
            options: {
                separator: separateurDeConcatenation,
                stripBanners: true,
            },
            dist: {
                src: [_JS+'1 - General/*.js'],
                dest: _JS+'/1 - General/General.concat.js'
            },
        },



        // Minifie le fichier js concatenant tous les fichiers JS
        uglify: {
            my_target:
            {
                files: [
                    {
                        expand: true,
                        cwd: _JS + '/1 - General/',
                        src: ['*.concat.js'],
                        dest: _JS + '/1 - General/',
                        ext: '.min.js'
                    },
                    {
                        expand: true,
                        cwd: _JS + '2 - Sections/',
                        src: ['*.js'],
                        dest: _JS + '/2 - Sections/',
                        ext: '.min.js'
                    },
                ]
            }
        },



        // Supprime les consol.log en distant
        removelogging: {
            dist: {
                src: _JS+'/**/*.min.js',
            }
        },

        

        // Compile les fichiers stylus en CSS
        stylus: {
            build: {
                options: {
                    linenos: true,
                    compress: false
                },
                files: [{
                    expand: true,
                    cwd: _stylus,
                    src: ['**/*.styl', '!global.styl'],
                    dest: _CSS,
                    ext: '.css'
                }]
            }
        },

        

        // Ajoute les préfixes CSS
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: ['> 1%']})
                ]
            },
            dist: {
                src: _CSS + '**/*.min.css'
            }
        },

        

        // Minifie les fichiers CSS
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: _CSS + 'Pages/',
                    src: ['**.css'],
                    dest: _CSS + 'Pages/',
                    ext: '.min.css'
                },
                {
                    expand: true,
                    cwd: _CSS + 'General/',
                    src: ['**.concat.css'],
                    dest: _CSS + 'General/',
                    ext: '.min.css'
                }],
            }
        },



        // Concataine tous les fichiers CSS choisit en un seul
        concat_css: {
            options: {
                separator: separateurDeConcatenation,
            },
            general: {
                src: [_CSS+"General/*.css"],
                dest: _CSS+'General/General.concat.css'
            },
            // sections: {
            //     src: [_CSS+"Pages/*.css"],
            //     dest: _CSS+'Pages/Pages.concat.css'
            // },
        },




        // Permet de tester les performances de son site en donnat un score sur 100
        pagespeed: {
            options: {
                nokey: true,
                url: "https://developers.google.com"
            },
            prod: {
                options: {
                    url: lienDuSiteATester,
                    locale: "fr_FR",
                    strategy: "desktop",
                    //Score nécessaire pour réussir le test
                    threshold: 80
                }
            },
            /*paths: {
                options: {
                    paths: ["/speed/docs/insights/v1/getting_started", "/speed/docs/about"],
                    locale: "fr_FR",
                    strategy: "desktop",
                    threshold: 80
                }
            }*/
        },


        // Génère toutes les favicons nécessaires à partir d'une image 
        // Ajoute les meta nécessaires au besoin dans une page
        favicons: {
            options: {
                trueColor: true,
                precomposed: true,
                coast: true,
                windowsTile: true,
                tileBlackWhite: false,
                tileColor: "auto",
                html: _header,
                HTMLPrefix: _favicon+'/'
            },
            icons: {
                src: _favicon,
                dest: _favicon
            }
        },

    });

    grunt.loadNpmTasks("grunt-remove-logging");

    
    grunt.registerTask('default', ['tinyimg', 'concat', 'uglify', 'removelogging', 'stylus', 'concat_css', 'cssmin', 'postcss', 'favicons']);

    grunt.registerTask('concatJsFiles', ['concat']);
    grunt.registerTask('minifyJS', ['uglify']);
    grunt.registerTask('removelog', ['removelogging']);
    grunt.registerTask('JS', ['concat', 'uglify', 'removelogging']);

    grunt.registerTask('minifyCSS', ['cssmin', 'notify:cssmin']);
    grunt.registerTask('concatCSS', ['concat_css']);
    grunt.registerTask('autoprefixeCSS', ['postcss', 'notify:postcss']);
    grunt.registerTask('CSS', ['concat_css', 'cssmin', 'postcss']);

    grunt.registerTask('icon', ['favicons']);
    grunt.registerTask('minifyImages', ['tinyimg']);


    grunt.registerTask('speedTest', ['pagespeed']);
};

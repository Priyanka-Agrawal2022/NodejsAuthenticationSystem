// render home views
module.exports.home = async (req, res) => {
  return res.render("home", {
    title: "Home",
  });
};

// render web app view
module.exports.app = async (req, res) => {
  return res.render("app", {
    title: "Web App",
  });
};

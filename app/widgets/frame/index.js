'use strict';

var Ractive = require('hive-ractive')
var initHeader = require('hive-header')
var menu = require('hive-menu')
var sendDialog = require('hive-send-dialog')
var initAuth = require('hive-auth')
var initHome = require('hive-home')
var initTransactions = require('hive-transactions')
var initContacts = require('hive-contacts')
var initSearch = require('hive-search')
var initSettings = require('hive-settings')
var router = require('hive-router').router
var walletExists = require('hive-wallet').walletExists
var emitter = require('hive-emitter')
var Arrival = require('./arrival')

module.exports = function(el){
  var frame = new Ractive({
    el: el,
    template: require('./index.ract').template
  })

  // widgets
  var header = initHeader(frame.find("#header"))
  menu(frame.find("#menu"))
  // sendDialog(frame.find("#send-dialog"))

  // pages
  var home = initHome(frame.find("#home"))
  var transactions = initTransactions(frame.find("#transactions"))
  var contacts = initContacts(frame.find("#contacts"))
  var search = initSearch(frame.find("#search"))
  var settings = initSettings(frame.find("#settings"))

  var currentPage = home

  // routes
  router.addRoute('/home', function(){
    showPage(home)
  })

  router.addRoute('/transactions', function(){
    showPage(transactions)
  })

  router.addRoute('/contacts', function(){
    showPage(contacts)
  })

  router.addRoute('/search', function(){
    showPage(search)
  })

  router.addRoute('/settings', function(){
    showPage(settings)
  })

  function showPage(page){
    currentPage.hide()
    page.show()
    currentPage = page
  }

  // auth
  var authEl = document.getElementById("auth")
  var auth = null

  walletExists(function(exists){
    auth = exists ? initAuth.login(authEl) : initAuth.register(authEl)
    auth.show()
  })

  emitter.on('wallet-ready', function(){
    auth.hide()
    frame.show()
  })

  // menu toggle
  emitter.on('toggle-menu', function(open) {
    var classes = frame.find("#main").classList
    if(open) {
      classes.add('closed')
    } else {
      classes.remove('closed')
    }

    header.toggleIcon(open)
  })

  return frame
}

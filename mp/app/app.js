import 'es6-shim';
import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/page1/page1';


var tic = angular.module('morpion', ['synchroscope'])

tic.controller('Game', function ($scope, $ync) {

    $scope.currentPlayer = 'O'
    $scope.player = 'O'
    $scope.winner = null
    $scope.board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]

    var keys = ['board', 'currentPlayer', 'winner']
    $ync($scope, keys, 'http://synchroscope.herokuapp.com/synchroscope#morpion')


    $scope.cellClass = function (row, column) {
        var value = cell(row, column)
        return 'cell cell-' + value
    }
    $scope.cellText = function (row, column) {
        var value = cell(row, column)
        return value ? value : '-'
    }
    $scope.cellClick = function (row, column) {
        if ($scope.winner) {
            alert('Already game over.')
            return
        }
        if ($scope.player != $scope.currentPlayer) {
            alert('Not your turn.')
            return
        }
        setCell(row, column, $scope.player)
        checkBoard()
        $scope.currentPlayer = nextPlayer($scope.currentPlayer)
    }
    $scope.newGame = function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                setCell(i, j, null)
            }
        }
        $scope.currentPlayer = 'O'
        $scope.player = 'O'
        $scope.winner = null
    }

    function cell(row, column) {
        return $scope.board[row][column]
    }

    function setCell(row, column, value) {
        $scope.board[row][column] = value
    }

    function nextPlayer(player) {
        return {
            O: 'X',
            X: 'O'
        }[player]
    }

    function checkBoard() {
        var winner, empty = false

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (!cell(i, j)) empty = true
            }
        }
        
        if (!empty) {
            $scope.winner = 'NONE'
            return
        }

        for (var i = 0; i < 3; i++) {
            if (cell(i, 0) && cell(i, 0) == cell(i, 1) && cell(i, 1) == cell(i, 2)) {
                winner = cell(i, 0)
            }
            if (cell(0, i) && cell(0, i) == cell(1, i) && cell(1, i) == cell(2, i)) {
                winner = cell(0, i)
            }
        }

        if (cell(0, 0) && cell(0, 0) == cell(1, 1) && cell(1, 1) == cell(2, 2)) {
            winner = cell(0, 0)
        }
        if (cell(0, 2) && cell(0, 2) == cell(1, 1) && cell(1, 1) == cell(2, 0)) {
            winner = cell(0, 2)
        }

        if (winner) {
            $scope.winner = winner
        }

    }
})
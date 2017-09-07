/**
 * EIP to Redmind 小工具
 * Author Gary Chen
 * Created by 2017/09/07
 */

/* global $, chrome, console */

$(function() {
    'use strict';

    var $container = $('.containter');
    var tabsId = 0;

    function collectHTML(form, url) {
        var obj = {};
        var regex = /<\/?(.|\n)*?>/g;
        var $content = $('.tabscontent');
        var urlMapping = {
            APP: 'friday-2-23',
            供應商: 'friday-2-24',
            大網: 'friday-2-21',
            商品: 'friday-12',
            客服: 'friday-2-2',
            小網: 'friday-2-22',
            帳務: 'friday-13',
            行銷: 'market2',
            訂單: 'friday-2-1',
            資料維運: 'maintain2'
        };

        $content.html(form);

        obj.eipUrl = url;
        obj.shopName = $content.find('#__館別-label').html();
        obj.funcName = $content.find('#__功能名稱-label').html();
        obj.moduleName = $content.find('#__系統模組名稱-label').html();
        obj.eipNumber = $content
            .find('table:eq(0)')
            .find('p:eq(1)')
            .html()
            .replace(regex, '');
        obj.completeDay = $content.find('#__希望完成日期-label').html();
        obj.desc = $content
            .find('table:eq(1)')
            .find('tr:eq(4)')
            .html()
            .replace(regex, '');

        var moduleNameNew = obj.moduleName.toUpperCase();
        if (urlMapping[moduleNameNew] !== undefined) {
            chrome.storage.sync.set({ data: JSON.stringify(obj) });
            setTimeout(function() {
                window.open('http://pm.hq.hiiir/projects/' + urlMapping[moduleNameNew] + '/issues/new');
            }, 50);
        }
    }

    //init content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (/eip\.hq\.hiiir\/(.*)/i.test(tabs[0].url)) {
            $container.find('h1').html('fetch data...');

            tabsId = tabs[0].id;

            chrome.tabs.executeScript(tabsId, { file: 'content_scripts.js' }, function() {
                chrome.tabs.sendMessage(tabsId, { action: 'init' }, function(response) {
                    if (response.formData !== undefined) {
                        collectHTML(response.formData, tabs[0].url);
                    }
                });
            });
        } else if (/pm\.hq\.hiiir\/(.*)/i.test(tabs[0].url)) {
            $container.find('h1').html('sync data...');

            tabsId = tabs[0].id;

            chrome.tabs.executeScript(tabsId, { file: 'content_scripts.js' }, function() {
                chrome.storage.sync.get('data', function(obj) {
                    if (Object.keys(obj).length > 0) {
                        chrome.tabs.sendMessage(tabsId, { action: 'set', data: obj.data }, function(response) {});
                    }
                });
            });
        } else {
            $container.find('h1').html('不支持使用!!!');
        }
    });
});

import React from 'react';
import ReactDOM from 'react-dom';
import Title from './title';
import Menu from './menu';
import Help from './help';
import Settings from './settings';
import Bookmarks from './bookmarks';
import Content from './content';

describe('Component Smoke Tests', () => {
    it('renders Title without crashing', () => {
        const div = document.createElement('div');
        const mockTitle = {
            english: 'Book Title',
            arabic: 'Arabic Title',
            bengali: 'Bengali Title'
        };
        ReactDOM.render(<Title lang="english" isMobile={false} title={mockTitle} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders Menu without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Menu component="content" showComponent={() => {}} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders Help without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Help showComponent={() => {}} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders Settings without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Settings lang="english" showComponent={() => {}} onLangChange={() => {}} />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders Bookmarks without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <Bookmarks
                bookmarks={{}}
                showComponent={() => {}}
                unBookmark={() => {}}
                onFetch={() => {}}
                lang="english"
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders Content without crashing', () => {
        const div = document.createElement('div');
        const mockPrayer = {
            id: 1,
            tags: 'saturday',
            arabic: 'Arabic text',
            english: 'English text',
            bengali: 'Bengali text'
        };
        const mockDays = {
            saturday: {
                previous: 'friday',
                begin: 1,
                size: 48,
                value: 'saturday',
                next: 'sunday'
            }
        };
        ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={() => {}}
                previous={() => {}}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});

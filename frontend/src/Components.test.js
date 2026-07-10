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
            <Settings 
                lang="english" 
                showComponent={() => {}} 
                onLangChange={() => {}} 
                arabicFont="noto"
                onArabicFontChange={() => {}}
                arabicSize="medium"
                onArabicSizeChange={() => {}}
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('triggers onArabicFontChange when font selection changes in Settings', () => {
        const div = document.createElement('div');
        const fontChangeMock = jest.fn();
        const settingsInstance = ReactDOM.render(
            <Settings 
                lang="english" 
                showComponent={() => {}} 
                onLangChange={() => {}} 
                arabicFont="noto"
                onArabicFontChange={fontChangeMock}
                arabicSize="medium"
                onArabicSizeChange={() => {}}
            />,
            div
        );

        settingsInstance.arabicFontChanged({ target: { value: 'scheherazade' } });

        expect(fontChangeMock).toHaveBeenCalledWith('scheherazade');
        ReactDOM.unmountComponentAtNode(div);
    });

    it('triggers onArabicSizeChange when font size selection changes in Settings', () => {
        const div = document.createElement('div');
        const sizeChangeMock = jest.fn();
        const settingsInstance = ReactDOM.render(
            <Settings 
                lang="english" 
                showComponent={() => {}} 
                onLangChange={() => {}} 
                arabicFont="noto"
                onArabicFontChange={() => {}}
                arabicSize="medium"
                onArabicSizeChange={sizeChangeMock}
            />,
            div
        );

        settingsInstance.arabicSizeChanged({ target: { value: 'large' } });

        expect(sizeChangeMock).toHaveBeenCalledWith('large');
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

    it('calls next when swiping left', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
            />,
            div
        );

        // Simulate swipe left (finger moves left: startX = 150, endX = 50)
        contentInstance.handleTouchStart({ touches: [{ clientX: 150, clientY: 100 }] });
        contentInstance.handleTouchMove({ touches: [{ clientX: 50, clientY: 100 }] });
        contentInstance.handleTouchEnd();

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(prevMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });

    it('calls previous when swiping right', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
            />,
            div
        );

        // Simulate swipe right (finger moves right: startX = 50, endX = 150)
        contentInstance.handleTouchStart({ touches: [{ clientX: 50, clientY: 100 }] });
        contentInstance.handleTouchMove({ touches: [{ clientX: 150, clientY: 100 }] });
        contentInstance.handleTouchEnd();

        expect(prevMock).toHaveBeenCalledTimes(1);
        expect(nextMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });

    it('calls next when clicking the right half of the content on mobile', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
                isMobile={true}
            />,
            div
        );

        const contentElement = div.querySelector('.content');
        contentElement.getBoundingClientRect = () => ({
            left: 10,
            width: 400,
            top: 0,
            right: 410,
            bottom: 600,
            height: 600
        });

        // Click right half: clientX = 250 (which is > left + width/2 = 10 + 200 = 210)
        const event = {
            clientX: 250,
            currentTarget: contentElement,
            target: contentElement
        };
        contentInstance.handleContentClick(event);

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(prevMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });

    it('calls previous when clicking the left half of the content on mobile', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
                isMobile={true}
            />,
            div
        );

        const contentElement = div.querySelector('.content');
        contentElement.getBoundingClientRect = () => ({
            left: 10,
            width: 400,
            top: 0,
            right: 410,
            bottom: 600,
            height: 600
        });

        // Click left half: clientX = 150 (which is < left + width/2 = 210)
        const event = {
            clientX: 150,
            currentTarget: contentElement,
            target: contentElement
        };
        contentInstance.handleContentClick(event);

        expect(prevMock).toHaveBeenCalledTimes(1);
        expect(nextMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });

    it('does not navigate when clicking on an interactive element (e.g. button) inside content', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
                isMobile={true}
            />,
            div
        );

        const contentElement = div.querySelector('.content');
        contentElement.getBoundingClientRect = () => ({
            left: 10,
            width: 400
        });

        const button = document.createElement('button');
        contentElement.appendChild(button);

        // Click right half but targeting the button
        const event = {
            clientX: 250,
            currentTarget: contentElement,
            target: button
        };
        contentInstance.handleContentClick(event);

        expect(nextMock).not.toHaveBeenCalled();
        expect(prevMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });

    it('does not navigate when isMobile is false', () => {
        const div = document.createElement('div');
        const mockPrayer = { id: 1, tags: 'saturday', arabic: 'a', english: 'e', bengali: 'b' };
        const mockDays = { saturday: { previous: 'f', begin: 1, size: 48, value: 's', next: 'su' } };
        const nextMock = jest.fn();
        const prevMock = jest.fn();
        const contentInstance = ReactDOM.render(
            <Content
                lang="english"
                prayer={mockPrayer}
                days={mockDays}
                bookmarks={{}}
                onDayChange={() => {}}
                onFetch={() => {}}
                next={nextMock}
                previous={prevMock}
                nextBookmark={() => {}}
                previousBookmark={() => {}}
                toggleBookmark={() => {}}
                isMobile={false}
            />,
            div
        );

        const contentElement = div.querySelector('.content');
        contentElement.getBoundingClientRect = () => ({
            left: 10,
            width: 400
        });

        const event = {
            clientX: 250,
            currentTarget: contentElement,
            target: contentElement
        };
        contentInstance.handleContentClick(event);

        expect(nextMock).not.toHaveBeenCalled();
        expect(prevMock).not.toHaveBeenCalled();
        ReactDOM.unmountComponentAtNode(div);
    });
});

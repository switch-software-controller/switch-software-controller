import type { PathJoiner } from '@switch-software-controller/path-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { CommandPathImpl } from './path.ts';

describe(CommandPathImpl, () => {
  let joiner: PathJoiner;
  let path: CommandPathImpl;

  beforeEach(() => {
    joiner = (...args) => args.join('/');
    path = new CommandPathImpl('./commandRoot', 'commandName', joiner);
  });

  describe('defaultImageExtension', () => {
    it('should return the default image extension', () => {
      expect(path.defaultImageExtension).toBe('png');
    });

    it('should set the default image extension', () => {
      path.defaultImageExtension = 'jpg';
      expect(path.defaultImageExtension).toBe('jpg');
    });

    it('should not set the default image extension if it is empty', () => {
      path.defaultImageExtension = '';
      expect(path.defaultImageExtension).toBe('png');
    });

    it('should not set the default image extension if it is null', () => {
      path.defaultImageExtension = '    ';
      expect(path.defaultImageExtension).toBe('png');
    });
  });

  describe('root', () => {
    it('should return the root path', () => {
      expect(path.root).toBe('./commandRoot/commandName');
    });
  });

  describe('command', () => {
    it('should return the command path', () => {
      expect(path.command).toBe('./commandRoot/commandName/src/index.ts');
    });
  });

  describe('info', () => {
    it('should return the info path', () => {
      expect(path.info).toBe('./commandRoot/commandName/info.json');
    });
  });

  describe('templates', () => {
    it('should return the templates path', () => {
      expect(path.templates).toBe('./commandRoot/commandName/templates');
    });
  });

  describe('captures', () => {
    it('should return the captures path', () => {
      expect(path.captures).toBe('./commandRoot/commandName/captures');
    });
  });

  describe('template', () => {
    it('should return the template path', () => {
      expect(path.template('file')).toBe(
        './commandRoot/commandName/templates/file.png',
      );
    });

    it('should return the template path with the specified extension', () => {
      expect(path.template('file', 'jpg')).toBe(
        './commandRoot/commandName/templates/file.jpg',
      );
    });
  });

  describe('capture', () => {
    it('should return the capture path', () => {
      expect(path.capture('file')).toBe(
        './commandRoot/commandName/captures/file.png',
      );
    });

    it('should return the capture path with the specified extension', () => {
      expect(path.capture('file', 'jpg')).toBe(
        './commandRoot/commandName/captures/file.jpg',
      );
    });
  });
});

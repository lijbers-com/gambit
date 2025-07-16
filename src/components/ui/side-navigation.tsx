'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './avatar';
import { NavigationItem } from './navigation-item';
import { NavigationItemWithSubmenu } from './navigation-item-with-submenu';
import { useMenu } from '@/hooks/use-menu';

export interface Route {
  id: number;
  name: string;
  url?: string;
  type?: 'parent' | 'title';
  icon?: {
    lucide?: string;
    url?: string;
  };
  subitems?: Route[];
}

export interface SideNavigationProps {
  routes: Route[];
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    svg?: React.ReactNode;
  };
  user?: {
    name?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export const SideNavigation = ({
  routes,
  logo,
  user,
  onLogout,
  className,
}: SideNavigationProps) => {
  const { collapsed } = useMenu();

  // filter all parents that dont have subitems
  const filteredRoutes = routes.filter(
    (item) =>
      item.type !== 'parent' ||
      (item.subitems && item.subitems.length > 0),
  );

  return (
    <div
      className={cn(
        // Make the sidebar fixed to the left, full height, and above content
        `fixed left-0 top-0 h-screen z-30 flex-shrink-0 text-sm flex flex-col transition-all duration-500 ease-in-out overflow-hidden scrollbar-hide`,
        collapsed ? 'w-[88px] pt-3 px-6 pb-6' : 'min-w-[270px] pt-3 px-6 pb-6',
        className
      )}
    >
      {/* Scrollable navigation area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className={cn("flex mb-8", collapsed && "justify-center")}>
          <a href="/">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8C0 3.58172 3.58172 0 8 0H32C36.4183 0 40 3.58172 40 8V32C40 36.4183 36.4183 40 32 40H8C3.58172 40 0 36.4183 0 32V8Z" fill="#00C81E"/>
              <path d="M16.187 23.0456V20.8184H25.0364V23.0456H21.9739V31.0002H19.2495V23.0456H16.187Z" fill="#0F172A"/>
              <path d="M15.1553 20.8184V31.0002H12.3911V20.8184H15.1553Z" fill="#0F172A"/>
              <path d="M3.03955 31.0002V20.8184H7.45432C8.22989 20.8184 8.88117 20.9228 9.40816 21.1316C9.93846 21.3404 10.3378 21.6354 10.6063 22.0165C10.8781 22.3977 11.014 22.8468 11.014 23.3638C11.014 23.7383 10.9311 24.0797 10.7654 24.388C10.603 24.6962 10.3743 24.9547 10.0793 25.1635C9.78434 25.369 9.43965 25.5115 9.04523 25.5911V25.6905C9.48273 25.7071 9.88046 25.8181 10.2384 26.0236C10.5964 26.2258 10.8814 26.5059 11.0935 26.8638C11.3056 27.2185 11.4117 27.6361 11.4117 28.1167C11.4117 28.6735 11.2659 29.169 10.9742 29.6032C10.6859 30.0373 10.2749 30.3787 9.74126 30.6273C9.20764 30.8759 8.57127 31.0002 7.83216 31.0002H3.03955ZM5.80376 28.7928H7.09637C7.56038 28.7928 7.9084 28.7066 8.1404 28.5343C8.37241 28.3586 8.48841 28.1001 8.48841 27.7587C8.48841 27.5201 8.43373 27.3179 8.32435 27.1522C8.21498 26.9864 8.0592 26.8605 7.85702 26.7743C7.65816 26.6882 7.41787 26.6451 7.13614 26.6451H5.80376V28.7928ZM5.80376 24.9348H6.93728C7.17923 24.9348 7.39301 24.8967 7.57861 24.8205C7.76422 24.7443 7.9084 24.6349 8.01114 24.4924C8.1172 24.3465 8.17023 24.1692 8.17023 23.9604C8.17023 23.6455 8.05754 23.4052 7.83216 23.2395C7.60679 23.0705 7.32175 22.986 6.97705 22.986H5.80376V24.9348Z" fill="#0F172A"/>
              <path d="M24.6821 8.81836H28.1225L30.4889 14.5854H30.6083L32.9747 8.81836H36.4151V19.0002H33.7105V13.1138H33.631L31.3639 18.9206H29.7333L27.4662 13.074H27.3867V19.0002H24.6821V8.81836Z" fill="#0F172A"/>
              <path d="M16.1846 19.0002H13.2017L16.5625 8.81836H20.3409L23.7017 19.0002H20.7187L18.4914 11.6223H18.4119L16.1846 19.0002ZM15.6278 14.9831H21.2358V17.0513H15.6278V14.9831Z" fill="#0F172A"/>
              <path d="M9.65199 12.1787C9.6089 12.003 9.54096 11.8489 9.44815 11.7164C9.35535 11.5805 9.23935 11.4661 9.10014 11.3733C8.96425 11.2772 8.80516 11.2059 8.62287 11.1595C8.44389 11.1098 8.24669 11.085 8.03125 11.085C7.56723 11.085 7.17116 11.196 6.84304 11.4181C6.51823 11.6401 6.26965 11.96 6.0973 12.3776C5.92827 12.7952 5.84375 13.299 5.84375 13.8889C5.84375 14.4855 5.92495 14.9959 6.08736 15.4202C6.24976 15.8444 6.49171 16.1692 6.81321 16.3946C7.13471 16.62 7.53409 16.7327 8.01136 16.7327C8.43229 16.7327 8.78196 16.6714 9.06037 16.5487C9.34209 16.4261 9.55256 16.2521 9.69176 16.0267C9.83097 15.8013 9.90057 15.5362 9.90057 15.2313L10.3778 15.281H8.05114V13.3122H12.5653V14.7242C12.5653 15.6522 12.3681 16.446 11.9737 17.1056C11.5826 17.7618 11.0424 18.2656 10.353 18.6169C9.6669 18.9649 8.87973 19.1389 7.99148 19.1389C7.00047 19.1389 6.13045 18.9285 5.38139 18.5075C4.63234 18.0866 4.04735 17.4867 3.62642 16.7078C3.20881 15.9289 3 15.0026 3 13.9287C3 13.0869 3.1276 12.3411 3.38281 11.6915C3.64134 11.0419 3.99929 10.4933 4.45668 10.0459C4.91406 9.59514 5.44271 9.25542 6.04261 9.02672C6.64252 8.79471 7.28551 8.67871 7.97159 8.67871C8.57481 8.67871 9.13494 8.76489 9.65199 8.93723C10.1723 9.10627 10.6314 9.34822 11.0291 9.66309C11.4302 9.97464 11.7533 10.3442 11.9986 10.7718C12.2438 11.1993 12.393 11.6683 12.446 12.1787H9.65199Z" fill="#0F172A"/>
            </svg>
          </a>
        </div>

        {filteredRoutes.map((item, index, arr) => {
          const nextItem = arr[index + 1];
          const isTitleType = item.type === 'title';
          const isNextMainType = nextItem?.type === undefined;
          const isNextParentWithSubitems =
            nextItem?.type === 'parent' &&
            (nextItem.subitems?.length ?? 0) > 0;

          const shouldShowTitle =
            isTitleType &&
            !collapsed &&
            (isNextMainType || isNextParentWithSubitems);

          return (
            <div key={item.id}>
              {shouldShowTitle && (
                <p className="text-slate-500 mb-6 mt-12 transition-opacity duration-300">{item.name}</p>
              )}

              {item.type === 'parent' &&
                (item.subitems?.length ?? 0) > 0 && (
                  <NavigationItemWithSubmenu item={item} />
                )}

              {!item.type && item.url && <NavigationItem item={item} />}
            </div>
          );
        })}
      </div>

      {/* Sticky avatar at the bottom */}
      <div className="mt-auto">
        {user && (
          <a
            className={cn(
              "flex items-center mb-6 mt-12 pr-2 rounded-md hover:bg-slate-100",
              collapsed && "justify-center pr-0"
            )}
            href="/profile"
          >
            <span className={cn("flex-shrink-0", collapsed ? "" : "mr-2")}>
              <Avatar>
                <AvatarImage
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURI(
                    user.name || 'profile',
                  )}&size=32`}
                />
              </Avatar>
            </span>
            <span className={cn('text-sm transition-opacity duration-300', collapsed && 'hidden')}>Profile</span>
          </a>
        )}
      </div>
    </div>
  );
}; 